import 'package:animate_do/animate_do.dart';
import 'package:flutter/widgets.dart';
import 'package:visibility_detector/visibility_detector.dart';

class InViewFade extends StatefulWidget {
  const InViewFade({
    super.key,
    required this.child,
    this.delay = Duration.zero,
    this.offsetY = 18,
  });

  final Widget child;
  final Duration delay;
  final double offsetY;

  @override
  State<InViewFade> createState() => _InViewFadeState();
}

class _InViewFadeState extends State<InViewFade> {
  // FIX: use a static counter for stable, unique keys instead of
  // widget.child.hashCode which changes on every rebuild causing
  // the VisibilityDetector to remount and re-trigger the animation.
  static int _counter = 0;
  late final int _id = _counter++;

  bool _shown = false;

  @override
  Widget build(BuildContext context) {
    return VisibilityDetector(
      key: ValueKey('in_view_fade_$_id'),
      onVisibilityChanged: (info) {
        if (_shown) return;
        if (info.visibleFraction > 0.12) setState(() => _shown = true);
      },
      child: _shown
          ? FadeInUp(
              from: widget.offsetY,
              duration: const Duration(milliseconds: 520),
              delay: widget.delay,
              child: widget.child,
            )
          : Opacity(opacity: 0, child: widget.child),
    );
  }
}
